import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRenderer } from './createRenderer'

type UniformLocation = WebGLUniformLocation & { name: string }

class ResizeObserverStub {
  observe = vi.fn()
  disconnect = vi.fn()
}

function createWebGlStub() {
  const uniforms = new Map<string, UniformLocation>()
  const bufferData = vi.fn()
  const drawElements = vi.fn()
  const uniform1f = vi.fn()

  const gl = {
    ARRAY_BUFFER: 0x8892,
    BLEND: 0x0be2,
    COLOR_BUFFER_BIT: 0x4000,
    COMPILE_STATUS: 0x8b81,
    DEPTH_TEST: 0x0b71,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    FLOAT: 0x1406,
    FRAGMENT_SHADER: 0x8b30,
    LINES: 0x0001,
    LINK_STATUS: 0x8b82,
    ONE_MINUS_SRC_ALPHA: 0x0303,
    SRC_ALPHA: 0x0302,
    STATIC_DRAW: 0x88e4,
    UNSIGNED_SHORT: 0x1403,
    VERTEX_SHADER: 0x8b31,
    attachShader: vi.fn(),
    bindBuffer: vi.fn(),
    bindVertexArray: vi.fn(),
    blendFunc: vi.fn(),
    bufferData,
    clear: vi.fn(),
    clearColor: vi.fn(),
    compileShader: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    createProgram: vi.fn(() => ({})),
    createShader: vi.fn(() => ({})),
    createVertexArray: vi.fn(() => ({})),
    deleteBuffer: vi.fn(),
    deleteProgram: vi.fn(),
    deleteShader: vi.fn(),
    deleteVertexArray: vi.fn(),
    disable: vi.fn(),
    drawElements,
    enable: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    getProgramInfoLog: vi.fn(() => ''),
    getProgramParameter: vi.fn(() => true),
    getShaderInfoLog: vi.fn(() => ''),
    getShaderParameter: vi.fn(() => true),
    getUniformLocation: vi.fn((_program: WebGLProgram, name: string) => {
      const location = { name } as UniformLocation
      uniforms.set(name, location)
      return location
    }),
    lineWidth: vi.fn(),
    linkProgram: vi.fn(),
    shaderSource: vi.fn(),
    uniform1f,
    uniform1i: vi.fn(),
    uniformMatrix4fv: vi.fn(),
    useProgram: vi.fn(),
    vertexAttribPointer: vi.fn(),
    viewport: vi.fn(),
  }

  return {
    gl: gl as unknown as WebGL2RenderingContext,
    calls: { bufferData, drawElements, uniform1f, uniforms },
  }
}

function createCanvas(gl: WebGL2RenderingContext, width: number, height: number) {
  const canvas = document.createElement('canvas')

  Object.defineProperty(canvas, 'getContext', {
    configurable: true,
    value: vi.fn(() => gl),
  })
  canvas.getBoundingClientRect = () =>
    ({
      bottom: height,
      height,
      left: 0,
      right: width,
      top: 0,
      width,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect

  return canvas
}

describe('createRenderer', () => {
  let callbacks: Map<number, FrameRequestCallback>
  let nextFrameId: number
  let documentHidden: boolean

  beforeEach(() => {
    callbacks = new Map()
    nextFrameId = 1
    documentHidden = false

    vi.stubGlobal('ResizeObserver', ResizeObserverStub)
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => documentHidden)
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        const id = nextFrameId
        nextFrameId += 1
        callbacks.set(id, callback)
        return id
      }),
    )
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn((id: number) => {
        callbacks.delete(id)
      }),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  function runFrame(timestamp: number) {
    const pending = [...callbacks.values()]
    callbacks.clear()
    for (const callback of pending) callback(timestamp)
  }

  it('caps WebGL drawing at 30 frames per second on a faster display', () => {
    const { gl, calls } = createWebGlStub()
    const renderer = createRenderer(createCanvas(gl, 1200, 800))

    renderer?.start()
    for (let frame = 0; frame <= 120; frame += 1) {
      runFrame((frame * 1000) / 120)
    }

    expect(calls.drawElements).toHaveBeenCalledTimes(31)
    const timeUniform = calls.uniforms.get('uTime')
    const finalAnimationTime = calls.uniform1f.mock.calls
      .filter(([location]) => location === timeUniform)
      .at(-1)?.[1]
    expect(finalAnimationTime).toBeCloseTo(1)
    renderer?.destroy()
  })

  it('keeps animation time aligned after a dropped foreground frame', () => {
    const { gl, calls } = createWebGlStub()
    const renderer = createRenderer(createCanvas(gl, 1200, 800))

    renderer?.start()
    runFrame(0)
    runFrame(1000)

    const timeUniform = calls.uniforms.get('uTime')
    const animationTimes = calls.uniform1f.mock.calls
      .filter(([location]) => location === timeUniform)
      .map(([, value]) => value)

    expect(animationTimes).toEqual([0, 1])
    renderer?.destroy()
  })

  it.each([
    {
      label: 'desktop',
      cssWidth: 1200,
      cssHeight: 800,
      devicePixelRatio: 2,
      expectedCanvasWidth: 1500,
      expectedPositionValues: 80 * 53 * 3,
      expectedIndices: 24_800,
    },
    {
      label: 'mobile',
      cssWidth: 500,
      cssHeight: 800,
      devicePixelRatio: 3,
      expectedCanvasWidth: 500,
      expectedPositionValues: 48 * 33 * 3,
      expectedIndices: 9_120,
    },
  ])(
    'uses the balanced $label geometry and pixel ratio',
    ({
      cssWidth,
      cssHeight,
      devicePixelRatio,
      expectedCanvasWidth,
      expectedPositionValues,
      expectedIndices,
    }) => {
      vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(devicePixelRatio)
      const { gl, calls } = createWebGlStub()
      const canvas = createCanvas(gl, cssWidth, cssHeight)
      const renderer = createRenderer(canvas)

      renderer?.start()

      const uploads = calls.bufferData.mock.calls.map(([, data]) => data)
      expect(canvas.width).toBe(expectedCanvasWidth)
      expect(uploads).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ length: expectedPositionValues }),
          expect.objectContaining({ length: expectedIndices }),
        ]),
      )
      renderer?.destroy()
    },
  )

  it('pauses while hidden and resumes without advancing the animation clock', () => {
    const { gl, calls } = createWebGlStub()
    const renderer = createRenderer(createCanvas(gl, 1200, 800))

    renderer?.start()
    runFrame(0)

    documentHidden = true
    document.dispatchEvent(new Event('visibilitychange'))
    expect(callbacks).toHaveLength(0)

    documentHidden = false
    document.dispatchEvent(new Event('visibilitychange'))
    runFrame(5000)
    runFrame(5034)

    const timeUniform = calls.uniforms.get('uTime')
    const animationTimes = calls.uniform1f.mock.calls
      .filter(([location]) => location === timeUniform)
      .map(([, value]) => value)

    expect(animationTimes).toEqual([0, 0, expect.closeTo(0.034, 3)])
    renderer?.destroy()
  })

  it('pauses for pagehide and resumes on pageshow', () => {
    const { gl, calls } = createWebGlStub()
    const renderer = createRenderer(createCanvas(gl, 1200, 800))

    renderer?.start()
    runFrame(0)
    window.dispatchEvent(new PageTransitionEvent('pagehide'))

    expect(callbacks).toHaveLength(0)

    window.dispatchEvent(new PageTransitionEvent('pageshow'))
    runFrame(5000)
    expect(calls.drawElements).toHaveBeenCalledTimes(2)
    renderer?.destroy()
  })

  it('renders one static frame for reduced motion', () => {
    const { gl, calls } = createWebGlStub()
    const renderer = createRenderer(createCanvas(gl, 1200, 800))

    renderer?.setReducedMotion(true)
    renderer?.start()

    expect(calls.drawElements).toHaveBeenCalledTimes(1)
    expect(callbacks).toHaveLength(0)
    renderer?.destroy()
  })

  it('does not render a zero-sized canvas', () => {
    const { gl, calls } = createWebGlStub()
    const renderer = createRenderer(createCanvas(gl, 0, 0))

    renderer?.start()

    expect(calls.drawElements).not.toHaveBeenCalled()
    expect(callbacks).toHaveLength(0)
    renderer?.destroy()
  })
})

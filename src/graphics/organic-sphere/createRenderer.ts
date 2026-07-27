import vertexShaderSource from '../../shaders/organic-sphere.vert.glsl?raw'
import fragmentShaderSource from '../../shaders/wireframe.frag.glsl?raw'
import { createSphereGrid, type SphereGridTopology } from './createSphereGrid'
import { createPerspectiveMatrix } from './matrices'
import {
  defaultOrganicSphereSettings,
  type OrganicSphereRenderer,
  type OrganicSphereSettings,
} from './types'
import { getWireframeStyleDefinition } from './wireframeStyles'

type RendererResources = {
  program: WebGLProgram
  vertexArray: WebGLVertexArrayObject
  positionBuffer: WebGLBuffer
  indexBuffer: WebGLBuffer
  uniforms: {
    projection: WebGLUniformLocation
    time: WebGLUniformLocation
    baseFrequency: WebGLUniformLocation
    frequency: WebGLUniformLocation
    baseAmplitude: WebGLUniformLocation
    peakAmplitude: WebGLUniformLocation
    peakSharpness: WebGLUniformLocation
    peakBias: WebGLUniformLocation
    warpStrength: WebGLUniformLocation
    warpFrequency: WebGLUniformLocation
    valleyAmplitude: WebGLUniformLocation
    detailFrequency: WebGLUniformLocation
    detailAmplitude: WebGLUniformLocation
    microFrequency: WebGLUniformLocation
    microAmplitude: WebGLUniformLocation
    scrollDistortion: WebGLUniformLocation
    rotation: WebGLUniformLocation
    cameraDistance: WebGLUniformLocation
    opacity: WebGLUniformLocation
    wireframeStyle: WebGLUniformLocation
  }
}

type SphereQuality = 'desktop' | 'mobile'

const DESKTOP_SEGMENTS = { longitude: 72, latitude: 48 }
const MOBILE_SEGMENTS = { longitude: 48, latitude: 32 }
const MOBILE_BREAKPOINT = 760
const MAX_DEVICE_PIXEL_RATIO = 1.5

function createShader(gl: WebGL2RenderingContext, shaderType: number, source: string): WebGLShader {
  const shader = gl.createShader(shaderType)

  if (!shader) {
    throw new Error('Unable to allocate a WebGL shader')
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'Unknown shader compilation error'
    gl.deleteShader(shader)
    throw new Error(message)
  }

  return shader
}

function createProgram(gl: WebGL2RenderingContext): WebGLProgram {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  const program = gl.createProgram()

  if (!program) {
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    throw new Error('Unable to allocate a WebGL program')
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? 'Unknown WebGL program linking error'
    gl.deleteProgram(program)
    throw new Error(message)
  }

  return program
}

function getUniform(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
): WebGLUniformLocation {
  const location = gl.getUniformLocation(program, name)

  if (!location) {
    throw new Error(`The ${name} shader uniform is unavailable`)
  }

  return location
}

function configureContext(gl: WebGL2RenderingContext) {
  gl.clearColor(0, 0, 0, 0)
  gl.disable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.lineWidth(1)
}

function createResources(gl: WebGL2RenderingContext): RendererResources {
  const program = createProgram(gl)
  const vertexArray = gl.createVertexArray()
  const positionBuffer = gl.createBuffer()
  const indexBuffer = gl.createBuffer()

  if (!vertexArray || !positionBuffer || !indexBuffer) {
    gl.deleteProgram(program)
    throw new Error('Unable to allocate the organic sphere geometry')
  }

  gl.bindVertexArray(vertexArray)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bindVertexArray(null)

  return {
    program,
    vertexArray,
    positionBuffer,
    indexBuffer,
    uniforms: {
      projection: getUniform(gl, program, 'uProjection'),
      time: getUniform(gl, program, 'uTime'),
      baseFrequency: getUniform(gl, program, 'uBaseFrequency'),
      frequency: getUniform(gl, program, 'uFrequency'),
      baseAmplitude: getUniform(gl, program, 'uBaseAmplitude'),
      peakAmplitude: getUniform(gl, program, 'uPeakAmplitude'),
      peakSharpness: getUniform(gl, program, 'uPeakSharpness'),
      peakBias: getUniform(gl, program, 'uPeakBias'),
      warpStrength: getUniform(gl, program, 'uWarpStrength'),
      warpFrequency: getUniform(gl, program, 'uWarpFrequency'),
      valleyAmplitude: getUniform(gl, program, 'uValleyAmplitude'),
      detailFrequency: getUniform(gl, program, 'uDetailFrequency'),
      detailAmplitude: getUniform(gl, program, 'uDetailAmplitude'),
      microFrequency: getUniform(gl, program, 'uMicroFrequency'),
      microAmplitude: getUniform(gl, program, 'uMicroAmplitude'),
      scrollDistortion: getUniform(gl, program, 'uScrollDistortion'),
      rotation: getUniform(gl, program, 'uRotation'),
      cameraDistance: getUniform(gl, program, 'uCameraDistance'),
      opacity: getUniform(gl, program, 'uOpacity'),
      wireframeStyle: getUniform(gl, program, 'uWireframeStyle'),
    },
  }
}

export function createRenderer(
  canvas: HTMLCanvasElement,
  overrides: Partial<OrganicSphereSettings> = {},
): OrganicSphereRenderer | null {
  const context = canvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    depth: false,
    preserveDrawingBuffer: false,
  })

  if (!context) {
    return null
  }

  const gl: WebGL2RenderingContext = context
  const settings: OrganicSphereSettings = {
    ...defaultOrganicSphereSettings,
    ...overrides,
  }

  let resources: RendererResources | undefined = createResources(gl)
  let projection = createPerspectiveMatrix(Math.PI / 4.5, 1, 0.1, 20)
  let indexCount = 0
  let quality: SphereQuality | undefined
  let topology: SphereGridTopology | undefined
  let cameraDistance = 3.05
  let animationFrame: number | undefined
  let isStarted = false
  let isInViewport = true
  let isPageVisible = !document.hidden
  let prefersReducedMotion = false
  let isContextLost = false
  let startTime = performance.now()
  let lastFrameTime = startTime
  let scrollDistortion = 0

  configureContext(gl)

  function replaceGeometry(nextQuality: SphereQuality) {
    const style = getWireframeStyleDefinition(settings.wireframeStyle)

    if (!resources || (quality === nextQuality && topology === style.topology)) {
      return
    }

    const segments = nextQuality === 'mobile' ? MOBILE_SEGMENTS : DESKTOP_SEGMENTS
    const geometry = createSphereGrid(segments.longitude, segments.latitude, style.topology)

    gl.bindBuffer(gl.ARRAY_BUFFER, resources.positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, geometry.positions, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resources.indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW)

    indexCount = geometry.indices.length
    quality = nextQuality
    topology = style.topology
  }

  function resize() {
    if (isContextLost || !resources) {
      return
    }

    const bounds = canvas.getBoundingClientRect()
    const cssWidth = Math.max(1, Math.round(bounds.width))
    const cssHeight = Math.max(1, Math.round(bounds.height))
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO)
    const displayWidth = Math.round(cssWidth * pixelRatio)
    const displayHeight = Math.round(cssHeight * pixelRatio)

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth
      canvas.height = displayHeight
    }

    gl.viewport(0, 0, displayWidth, displayHeight)
    const nextQuality = cssWidth <= MOBILE_BREAKPOINT ? 'mobile' : 'desktop'
    replaceGeometry(nextQuality)
    cameraDistance = nextQuality === 'mobile' ? 6.1 : 3.9
    projection = createPerspectiveMatrix(Math.PI / 4.5, cssWidth / cssHeight, 0.1, 20)
    requestRender()
  }

  function render(timestamp: number) {
    if (isContextLost || !resources || indexCount === 0) {
      return
    }

    const elapsedSeconds = Math.max(0, (timestamp - startTime) / 1000)
    const frameDelta = Math.min(0.1, Math.max(0, (timestamp - lastFrameTime) / 1000))
    const animationTime = prefersReducedMotion ? 0 : elapsedSeconds * settings.animationSpeed
    const rotation = prefersReducedMotion ? 0.35 : elapsedSeconds * settings.rotationSpeed

    lastFrameTime = timestamp
    scrollDistortion *= Math.exp(-frameDelta * 5.5)

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(resources.program)
    gl.bindVertexArray(resources.vertexArray)
    gl.uniformMatrix4fv(resources.uniforms.projection, false, projection)
    gl.uniform1f(resources.uniforms.time, animationTime)
    gl.uniform1f(resources.uniforms.baseFrequency, settings.baseFrequency)
    gl.uniform1f(resources.uniforms.frequency, settings.frequency)
    gl.uniform1f(resources.uniforms.baseAmplitude, settings.baseAmplitude)
    gl.uniform1f(resources.uniforms.peakAmplitude, settings.peakAmplitude)
    gl.uniform1f(resources.uniforms.peakSharpness, settings.peakSharpness)
    gl.uniform1f(resources.uniforms.peakBias, settings.peakBias)
    gl.uniform1f(resources.uniforms.warpStrength, settings.warpStrength)
    gl.uniform1f(resources.uniforms.warpFrequency, settings.warpFrequency)
    gl.uniform1f(resources.uniforms.valleyAmplitude, settings.valleyAmplitude)
    gl.uniform1f(resources.uniforms.detailFrequency, settings.detailFrequency)
    gl.uniform1f(resources.uniforms.detailAmplitude, settings.detailAmplitude)
    gl.uniform1f(resources.uniforms.microFrequency, settings.microFrequency)
    gl.uniform1f(resources.uniforms.microAmplitude, settings.microAmplitude)
    gl.uniform1f(
      resources.uniforms.scrollDistortion,
      prefersReducedMotion ? 0 : scrollDistortion,
    )
    gl.uniform1f(resources.uniforms.rotation, rotation)
    gl.uniform1f(resources.uniforms.cameraDistance, cameraDistance)
    gl.uniform1f(resources.uniforms.opacity, settings.opacity)
    gl.uniform1i(
      resources.uniforms.wireframeStyle,
      getWireframeStyleDefinition(settings.wireframeStyle).shaderIndex,
    )
    gl.drawElements(gl.LINES, indexCount, gl.UNSIGNED_SHORT, 0)
    gl.bindVertexArray(null)
  }

  function shouldAnimate() {
    return isStarted && isInViewport && isPageVisible && !prefersReducedMotion && !isContextLost
  }

  function cancelAnimation() {
    if (animationFrame === undefined) {
      return
    }

    window.cancelAnimationFrame(animationFrame)
    animationFrame = undefined
  }

  function drawFrame(timestamp: number) {
    animationFrame = undefined
    render(timestamp)

    if (shouldAnimate()) {
      animationFrame = window.requestAnimationFrame(drawFrame)
    }
  }

  function requestRender() {
    if (!isStarted || !isInViewport || !isPageVisible || isContextLost) {
      return
    }

    if (prefersReducedMotion) {
      cancelAnimation()
      render(startTime)
      return
    }

    if (animationFrame === undefined) {
      animationFrame = window.requestAnimationFrame(drawFrame)
    }
  }

  function handleVisibilityChange() {
    isPageVisible = !document.hidden

    if (isPageVisible) {
      requestRender()
    } else {
      cancelAnimation()
    }
  }

  function handleContextLost(event: Event) {
    event.preventDefault()
    isContextLost = true
    resources = undefined
    cancelAnimation()
  }

  function handleContextRestored() {
    isContextLost = false
    resources = createResources(gl)
    configureContext(gl)
    quality = undefined
    topology = undefined
    startTime = performance.now()
    lastFrameTime = startTime
    resize()
  }

  const resizeObserver =
    typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => resize())

  if (resizeObserver) {
    resizeObserver.observe(canvas)
  } else {
    window.addEventListener('resize', resize)
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  canvas.addEventListener('webglcontextlost', handleContextLost)
  canvas.addEventListener('webglcontextrestored', handleContextRestored)

  return {
    start() {
      if (isStarted) {
        return
      }

      isStarted = true
      startTime = performance.now()
      lastFrameTime = startTime
      resize()
      requestRender()
    },
    setInViewport(nextIsInViewport) {
      isInViewport = nextIsInViewport

      if (isInViewport) {
        requestRender()
      } else {
        cancelAnimation()
      }
    },
    setReducedMotion(nextPrefersReducedMotion) {
      prefersReducedMotion = nextPrefersReducedMotion
      requestRender()
    },
    setScrollDistortion(strength) {
      if (prefersReducedMotion) {
        return
      }

      scrollDistortion = Math.max(scrollDistortion, Math.min(1, Math.max(0, strength)))
      requestRender()
    },
    setSettings(nextSettings) {
      const previousStyle = settings.wireframeStyle
      Object.assign(settings, nextSettings)

      if (settings.wireframeStyle !== previousStyle) {
        resize()
      } else {
        requestRender()
      }
    },
    destroy() {
      isStarted = false
      cancelAnimation()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)

      if (resources && !isContextLost) {
        gl.deleteBuffer(resources.positionBuffer)
        gl.deleteBuffer(resources.indexBuffer)
        gl.deleteVertexArray(resources.vertexArray)
        gl.deleteProgram(resources.program)
      }

      resources = undefined
    },
  }
}

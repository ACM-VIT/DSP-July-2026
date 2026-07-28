import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App.vue'

const viewportHeight = 800

// Mirrors the narrow-screen layout, where the two copy-heavy sections grow past the viewport.
const sectionLayout: Record<string, { top: number; height: number }> = {
  home: { top: 0, height: viewportHeight },
  'about-event': { top: 800, height: 1200 },
  'about-speaker': { top: 2000, height: 1100 },
  'event-details': { top: 3100, height: viewportHeight },
  'site-footer': { top: 3900, height: 400 },
}

const pageHeight = 4300

function stubScrollLayout(wrapper: VueWrapper) {
  for (const [id, box] of Object.entries(sectionLayout)) {
    const element = wrapper.element.ownerDocument.getElementById(id)
    if (!element) throw new Error(`missing section #${id}`)
    element.getBoundingClientRect = () =>
      ({ top: box.top - window.scrollY, height: box.height }) as DOMRect
  }

  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(pageHeight)
  Object.defineProperty(window, 'innerHeight', { value: viewportHeight, configurable: true })
}

function scrollWheel(scrollY: number, deltaY: number) {
  Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true })
  const event = new WheelEvent('wheel', { deltaY, cancelable: true })
  window.dispatchEvent(event)
  return event
}

describe('App section snapping', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('lets a taller-than-viewport section scroll normally and snaps at its edges', () => {
    // Lenis is skipped without ResizeObserver, so snapping falls back to window.scrollTo.
    Reflect.deleteProperty(globalThis, 'ResizeObserver')
    const scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, configurable: true })

    const wrapper = mount(App, { attachTo: document.body })
    stubScrollLayout(wrapper)

    // Mid-section, in either direction, the page keeps its native scrolling.
    expect(scrollWheel(1000, 120).defaultPrevented).toBe(false)
    expect(scrollWheel(1000, -120).defaultPrevented).toBe(false)
    expect(scrollTo).not.toHaveBeenCalled()

    // Only at the end of #about-event (top 800 + height 1200 - viewport 800) does it snap on.
    expect(scrollWheel(1200, 120).defaultPrevented).toBe(true)
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 2000, behavior: 'smooth' })

    wrapper.unmount()
  })

  it('enters a tall section from below at its bottom edge', () => {
    Reflect.deleteProperty(globalThis, 'ResizeObserver')
    const scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, configurable: true })

    const wrapper = mount(App, { attachTo: document.body })
    stubScrollLayout(wrapper)

    // From the top of #event-details, scrolling up lands on the end of #about-speaker
    // (top 2000 + height 1100 - viewport 800) rather than skipping its copy.
    expect(scrollWheel(3100, -120).defaultPrevented).toBe(true)
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 2300, behavior: 'smooth' })

    wrapper.unmount()
  })

  it('waits for a deliberate push at a section edge before snapping', () => {
    Reflect.deleteProperty(globalThis, 'ResizeObserver')
    const scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, configurable: true })

    const wrapper = mount(App, { attachTo: document.body })
    stubScrollLayout(wrapper)

    // Feathered trackpad ticks at the edge are swallowed rather than snapping or drifting.
    for (let tick = 0; tick < 3; tick += 1) {
      expect(scrollWheel(0, 20).defaultPrevented).toBe(true)
    }
    expect(scrollTo).not.toHaveBeenCalled()

    // Once the accumulated push clears the threshold, the section change goes through.
    expect(scrollWheel(0, 40).defaultPrevented).toBe(true)
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 800, behavior: 'smooth' })

    wrapper.unmount()
  })
})

describe('App', () => {
  it('renders the first final landing screen content', () => {
    const wrapper = mount(App)

    expect(wrapper.findAll('main > section').map((section) => section.attributes('id'))).toEqual([
      'home',
      'about-event',
      'about-speaker',
      'event-details',
    ])
    expect(wrapper.get('h1').text()).toBe(
      'A Hands-On Workshop: Building Advanced AI Applications and Agents in One Hour',
    )
    expect(wrapper.get('img').attributes('alt')).toBe('ACM VIT Student Chapter')
    expect(wrapper.get('img[alt="ACM Distinguished Speaker Program"]').attributes('alt')).toBe(
      'ACM Distinguished Speaker Program',
    )
    expect(wrapper.get('a[href="#about-event"]').text()).toBe('About Event')
    expect(wrapper.get('a[href="#about-speaker"]').text()).toBe('About Speaker')
    expect(wrapper.get('#about-event h2').text()).toBe('About the Event')
    expect(wrapper.get('#about-speaker h2').text()).toBe('About The Speaker')
    expect(wrapper.get('#about-event').text()).toContain('This ACM Distinguished Speaker Program')
    expect(wrapper.get('#about-speaker').text()).toContain(
      'Dr. Mehdi Bahrami is a Principal Researcher',
    )
    expect(wrapper.get('#about-speaker img').attributes('alt')).toBe('Mehdi Bahrami')
    expect(wrapper.get('#event-details h2').text()).toBe('Event Details')
    expect(wrapper.get('#event-details').text()).toContain('30 July 2026')
    expect(wrapper.get('#event-details').text()).toContain('8:30 PM - 9:30 PM IST')
    expect(wrapper.get('#event-details').text()).toContain('Platform')
    expect(wrapper.get('#event-details').text()).toContain('Google Meet')
    expect(wrapper.get('#event-details').classes()).toEqual(
      expect.arrayContaining(['h-screen', 'justify-center', 'overflow-hidden']),
    )
    expect(wrapper.findAll('.event-schedule__row')).toHaveLength(0)
    expect(wrapper.get('#event-details').text()).not.toContain('Event Schedule')
    expect(wrapper.findAll('[data-testid="dot-field-background"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-particle]')).toHaveLength(72)
    expect(wrapper.findAll('[data-testid="organic-wire-sphere"]')).toHaveLength(1)
    expect(wrapper.get('[data-testid="organic-wire-sphere"]').classes()).toContain('h-svh')
    expect(wrapper.find('[data-testid="organic-sphere-dev-panel"]').exists()).toBe(false)
    expect(wrapper.get('#about-speaker .pixel-card img').attributes('alt')).toBe('Mehdi Bahrami')
    expect(wrapper.get('#about-speaker .pixel-card').attributes('data-pixel-density')).toBe('0.5')
  })
})

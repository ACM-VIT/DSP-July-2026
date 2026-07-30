import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CountdownTimer from './CountdownTimer.vue'

const sessionUrl = 'https://conclave.acmvit.in/dsp-session'

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders and updates a live countdown without drift', async () => {
    const wrapper = mount(CountdownTimer, {
      props: { target: '2026-01-01T09:09:45.000Z', sessionUrl },
    })

    expect(wrapper.get('[data-testid="countdown-hours"]').text()).toBe('09')
    expect(wrapper.get('[data-testid="countdown-minutes"]').text()).toBe('09')
    expect(wrapper.get('[data-testid="countdown-seconds"]').text()).toBe('45')

    await vi.advanceTimersByTimeAsync(1000)

    expect(wrapper.get('[data-testid="countdown-seconds"]').text()).toBe('44')
  })

  it('keeps total hours when the target is more than four days away', () => {
    const wrapper = mount(CountdownTimer, {
      props: { target: '2026-01-06T00:00:00.000Z', sessionUrl },
    })

    expect(wrapper.get('[data-testid="countdown-hours"]').text()).toBe('120')
  })

  it('replaces an expired countdown with the join session link', () => {
    const wrapper = mount(CountdownTimer, {
      props: { target: '2025-12-31T23:59:59.000Z', sessionUrl },
    })

    expect(wrapper.find('[data-testid="countdown-hours"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="join-session"]').text()).toContain('Join the session')
    expect(wrapper.get('[data-testid="join-session"]').attributes()).toMatchObject({
      href: sessionUrl,
      target: '_blank',
      rel: 'noopener noreferrer',
    })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('swaps to the join session link when the countdown reaches zero', async () => {
    const wrapper = mount(CountdownTimer, {
      props: { target: '2026-01-01T00:00:02.000Z', sessionUrl },
    })

    expect(wrapper.get('[data-testid="countdown-seconds"]').text()).toBe('02')

    await vi.advanceTimersByTimeAsync(2000)

    expect(wrapper.find('[data-testid="countdown-seconds"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="join-session"]').text()).toContain('Join the session')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cleans up its interval when unmounted', () => {
    const wrapper = mount(CountdownTimer, {
      props: { target: '2026-01-01T00:01:00.000Z', sessionUrl },
    })

    expect(vi.getTimerCount()).toBe(1)
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})

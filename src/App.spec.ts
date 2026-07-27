import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from './App.vue'

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
    expect(wrapper.get('a[href="#about-event"]').text()).toBe('About Event')
    expect(wrapper.get('a[href="#about-speaker"]').text()).toBe('About Speaker')
    expect(wrapper.get('#about-event h2').text()).toBe('About the Event')
    expect(wrapper.get('#about-speaker h2').text()).toBe('About The Speaker')
    expect(wrapper.get('#about-speaker img').attributes('alt')).toBe('Mehdi Bahrami')
    expect(wrapper.get('#event-details h2').text()).toBe('Event Details')
    expect(wrapper.get('#event-details').text()).toContain('19 June, 2026')
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

import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import {
  defaultOrganicSphereSettings,
  noisyOrganicSphereSettings,
} from '../graphics/organic-sphere/types'
import OrganicSphereDevPanel from './OrganicSphereDevPanel.vue'

describe('OrganicSphereDevPanel', () => {
  it('starts from the supplied original settings and emits live slider changes', async () => {
    const wrapper = mount(OrganicSphereDevPanel, {
      props: {
        modelValue: { ...defaultOrganicSphereSettings },
      },
    })

    const frequency = wrapper.get('input[type="range"]')
    expect(wrapper.findAll('input[type="range"]')).toHaveLength(16)
    expect((frequency.element as HTMLInputElement).value).toBe(
      String(defaultOrganicSphereSettings.baseFrequency),
    )

    await frequency.setValue('3.2')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatchObject({
      baseFrequency: 3.2,
    })
  })

  it('changes style without changing deformation settings', async () => {
    const settings = { ...defaultOrganicSphereSettings, frequency: 3.7 }
    const wrapper = mount(OrganicSphereDevPanel, {
      props: {
        modelValue: settings,
      },
    })

    await wrapper.get('[data-style="chaos-lattice"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual({
      ...settings,
      wireframeStyle: 'chaos-lattice',
    })
  })

  it('offers high noise without replacing the selected style', async () => {
    const wrapper = mount(OrganicSphereDevPanel, {
      props: {
        modelValue: {
          ...defaultOrganicSphereSettings,
          wireframeStyle: 'ghost-xray',
        },
      },
    })

    const noisyButton = wrapper.findAll('button').find((button) => button.text() === 'Noisy preset')
    await noisyButton?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual({
      ...noisyOrganicSphereSettings,
      wireframeStyle: 'ghost-xray',
    })
  })

  it('resets the style and deformation to the original settings', async () => {
    const wrapper = mount(OrganicSphereDevPanel, {
      props: {
        modelValue: {
          ...noisyOrganicSphereSettings,
          wireframeStyle: 'aurora-flow',
        },
      },
    })

    const originalButton = wrapper.findAll('button').find((button) => button.text() === 'Original')
    await originalButton?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(defaultOrganicSphereSettings)
  })

  it('copies the complete current settings as JSON', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    const settings = { ...defaultOrganicSphereSettings, frequency: 3.7 }
    const wrapper = mount(OrganicSphereDevPanel, {
      props: {
        modelValue: settings,
      },
    })

    const copyButton = wrapper.findAll('button').find((button) => button.text() === 'Copy values')
    await copyButton?.trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith(JSON.stringify(settings, null, 2))
    expect(copyButton?.text()).toBe('Copied!')
    wrapper.unmount()
  })
})

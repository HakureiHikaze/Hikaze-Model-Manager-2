import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HikazeManagerLayout from '../HikazeManagerLayout.vue'

describe('HikazeManagerLayout', () => {
  it('renders header (nav) by default', () => {
    const wrapper = mount(HikazeManagerLayout)
    expect(wrapper.find('.hikaze-header').exists()).toBe(true)
    expect(wrapper.classes()).not.toContain('is-embedded')
  })

  it('hides header when embedded is true', () => {
    const wrapper = mount(HikazeManagerLayout, {
      props: {
        embedded: true
      }
    })
    expect(wrapper.find('.hikaze-header').exists()).toBe(false)
    expect(wrapper.classes()).toContain('is-embedded')
  })

  it('hides header when initialTab is present', () => {
    const wrapper = mount(HikazeManagerLayout, {
      props: {
        initialTab: 'checkpoints'
      }
    })
    expect(wrapper.find('.hikaze-header').exists()).toBe(false)
    expect(wrapper.classes()).toContain('has-initial-tab')
  })
})

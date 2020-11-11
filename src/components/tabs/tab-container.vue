<script>
export default {
  props: {
    panels: {
      type: Array,
      required: true
    }
  },
  render() {
    const panel = this.panels.map((tab) => {
      return tab.active ? tab.$slots.default : null
    })
    return (
      <div>
        {panel}
      </div>
      )
    }
  }
  </script>
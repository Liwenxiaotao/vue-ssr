<script>
export default {
  name: 'Tab',
  props: {
    index: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      default: 'tab'
    }
  },
  computed: {
    active() {
      return this.$parent.activedIndex === this.index
    }
  },
  methods: {
    handleChangeTab() {
      if (this.active) return
      this.$parent.changeTab(this.index)
    }
  },
  mounted() {
    this.$parent.panels.push(this)
  },
  render() {
    const tab = this.$slots.label || <span> {this.label} </span>
    const className = {
      tab: true,
      active: this.active
    }
    return (
      <li class={className} on-click={this.handleChangeTab}>
        {tab}
      </li>
    )
  }
}
</script>
<style lang="scss" scoped>
  .tab{
    list-style: none;
    line-height: 40px;
    margin-right: 30px;
    position: relative;
    bottom: -2px;
    cursor: pointer;
  &.active{
    border-bottom: 2px solid blue;
  }
  &:last-child{
    margin-right: 0;
  }
}
</style>
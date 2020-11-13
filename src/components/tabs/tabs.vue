
<script>
// 遗留问题，slot的数据没法响应
import TabContainer from './tab-container.vue'
export default {
  name: 'Tabs',
  components: {
    TabContainer
  },
  props: {
    value: {
      type: [String, Number],
      default: '1'
    }
  },
  data() {
    return {
      activedIndex: '',
      panels: []
    }
  },
  beforeMount() {
    this.activedIndex = this.value
  },
  methods: {
    changeTab(index) {
      this.activedIndex = index
      this.$emit('change', index)
    },
    forceRender() {
      this.panels = [...this.panels]
    }
  },
  render() {
    return (
      <div class="tabs">
        <ul class="tabs-header">
          { this.$slots.default }
        </ul>
        <tab-container panels={this.panels}></tab-container>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
.tabs-header{
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  border-bottom: 2px solid #ededed;
}
</style>

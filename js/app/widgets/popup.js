export const popup = {
  props: ['title', 'fullscreen'],
  data() {
    return {
      active: 0,
      top: 0,
      widthVal: '500px',
      ml: '-250px',
      left: '50%',
      height: 'auto'
    }
  },
  watch: {
    active(newVal) {
      if (newVal == 1) {
        // Если полноэкранный режим передан или ширина окна меньше или равна 1024px,
        // то открываем попап на весь экран
        if (this.fullscreen || window.innerWidth <= 1024) {
          this.top = 0;
          this.widthVal = '100%';
          this.ml = 0;
          this.left = 0;
          this.height = '100%';
        } else {
          // Иначе – открываем попап по центру
          let self = this;
          setTimeout(function() {
            let height = self.$refs.popup.clientHeight / 2;
            self.top = `calc(50% - ${height}px)`;
          }, 10);
        }
      }
    }
  },
  template: `
    <template v-if="active==1">
      <div class="popup-back"></div>
      <div class="popup" :style="{ top: top, 'max-width': widthVal, 'margin-left': ml, left: left, height: height }" ref="popup">
        <div class="head-popup">
          <div class="w80 ptb20">
            <div class="head-title">{{ title }}</div>
          </div>
          <div class="w20 al ptb20">
            <a href="#" @click.prevent="active = 0"><i class="fas fa-window-close"></i></a>
          </div>
        </div>
        <div class="popup-inner">
          <slot />
        </div>
      </div>
    </template>
  `
};

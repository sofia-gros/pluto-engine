import DefaultTheme from 'vitepress/theme';
import BenchmarkChart from './BenchmarkChart.vue';
import type { Theme } from 'vitepress';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('BenchmarkChart', BenchmarkChart);
  },
} satisfies Theme;

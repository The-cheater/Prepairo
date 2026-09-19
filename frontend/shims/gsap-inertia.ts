// Shim for GSAP InertiaPlugin
export const InertiaPlugin = {
  name: 'inertia',
  init(target: any, values: any, tween: any) {
    if (!values) return;
    const duration = tween.duration() || 0.6;
    const keys = Object.keys(values).filter(k => k !== 'resistance');
    for (const key of keys) {
      const val = values[key];
      const endVal = typeof val === 'number' ? val : (val?.velocity ? val.velocity * 0.2 : 0);
      (this as any)._props.push(key);
      (this as any)._targets.push(target);
      (this as any)._start.push(target[key] || 0);
      (this as any)._change.push(endVal - (target[key] || 0));
    }
  },
  render(progress: number, data: any) {
    // Easing out smoothly
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    for (let i = 0; i < (data?._props?.length || 0); i++) {
      const prop = data._props[i];
      const target = data._targets[i];
      if (target && prop) {
        target[prop] = data._start[i] + data._change[i] * easeProgress;
      }
    }
  },
  _props: [] as string[],
  _targets: [] as any[],
  _start: [] as number[],
  _change: [] as number[],
  register(core: any) {
    if (core && core.registerPlugin) {
      // plugin registered
    }
  }
};

export default InertiaPlugin;

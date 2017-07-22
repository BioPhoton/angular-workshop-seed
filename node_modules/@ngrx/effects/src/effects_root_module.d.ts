import { EffectsRunner } from './effects_runner';
import { EffectSources } from './effect_sources';
export declare class EffectsRootModule {
    private sources;
    constructor(sources: EffectSources, runner: EffectsRunner, rootEffects: any[]);
    addEffects(effectSourceInstance: any): void;
}

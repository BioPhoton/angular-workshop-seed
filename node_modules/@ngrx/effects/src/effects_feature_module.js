import { NgModule, Inject } from '@angular/core';
import { EffectsRootModule } from './effects_root_module';
import { FEATURE_EFFECTS } from './tokens';
export class EffectsFeatureModule {
    /**
     * @param {?} root
     * @param {?} effectSourceGroups
     */
    constructor(root, effectSourceGroups) {
        this.root = root;
        effectSourceGroups.forEach(group => group.forEach(effectSourceInstance => root.addEffects(effectSourceInstance)));
    }
}
EffectsFeatureModule.decorators = [
    { type: NgModule, args: [{},] },
];
/**
 * @nocollapse
 */
EffectsFeatureModule.ctorParameters = () => [
    { type: EffectsRootModule, },
    { type: Array, decorators: [{ type: Inject, args: [FEATURE_EFFECTS,] },] },
];
function EffectsFeatureModule_tsickle_Closure_declarations() {
    /** @type {?} */
    EffectsFeatureModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    EffectsFeatureModule.ctorParameters;
    /** @type {?} */
    EffectsFeatureModule.prototype.root;
}
//# sourceMappingURL=effects_feature_module.js.map
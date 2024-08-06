// Symbôles non exportés pour indexer les propriétés privées du Mixin.
const privatePropName1 = Symbol('privatePropName1');
const privatePropName2 = Symbol('privatePropName2');
// ...
// Symbôles exportés pour indexer les propriétés protégées du Mixin.
export const protectedPropName1 = Symbol('protectedPropName1');
export const protectedPropName2 = Symbol('protectedPropName2');
/**
 * Le Mixin.
 */
export function Mixin(superClass) {
    class MixinClass extends superClass {
        static [privatePropName2];
        static [protectedPropName2];
        static publicPropName2;
        [privatePropName1];
        [protectedPropName1];
        publicPropName1;
    }
    return MixinClass;
}

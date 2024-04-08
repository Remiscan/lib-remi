/** Constructeur d'une classe abstraite **ou concrète** étandant `BaseClass` */
export type AbstractConstructor<BaseClass = object> = abstract new (...args: any[]) => BaseClass;

/** Classe renvoyée par un Mixin. */
export type MixinReturn<BaseClass, MixinClass = object> = AbstractConstructor<MixinClass> & BaseClass;

// Symbôles non exportés pour indexer les propriétés privées du Mixin.
const privatePropName1: unique symbol = Symbol('privatePropName1');
const privatePropName2: unique symbol = Symbol('privatePropName2');
// ...

// Symbôles exportés pour indexer les propriétés protégées du Mixin.
export const protectedPropName1: unique symbol = Symbol('protectedPropName1');
export const protectedPropName2: unique symbol = Symbol('protectedPropName2');
// ...

/**
 * Interface de la classe renvoyée par le Mixin.
 */
export interface MixinInterface {
	[privatePropName1]: unknown;
	[protectedPropName1]: unknown;
	publicPropName1: unknown;
}

/**
 * Interface du constructeur de la classe renvoyée par le Mixin.  
 * Les propriétés définies ici sont les propriétés statiques de la classe renvoyée par le Mixin.
 */
export interface MixinConstructorInterface {
	[privatePropName2]: unknown;
	[protectedPropName2]: unknown;
	publicPropName2: unknown;
}

/**
 * Le Mixin.
 */
export function Mixin<T extends AbstractConstructor<any>>(
	superClass: T
): MixinReturn<T & MixinConstructorInterface, MixinInterface> {
	abstract class MixinClass extends superClass implements MixinInterface {
		static [privatePropName2]: unknown;
		static [protectedPropName2]: unknown;
		static publicPropName2: unknown;

		[privatePropName1]: unknown;
		[protectedPropName1]: unknown;
		publicPropName1: unknown;
	}

	return MixinClass;
}
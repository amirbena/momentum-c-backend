import { ValidationOptions, registerDecorator, ValidationArguments, buildMessage } from 'class-validator';
import { AccessLayer } from 'src/constants/constants';

export function IsAccessLayerArray(validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsAccessLayerArray',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return Array.isArray(value) && value.every(accessLayer => Object.values(AccessLayer).includes(accessLayer));
                },
                // Specifiy your error message here.
                defaultMessage: buildMessage(
                    eachPrefix =>
                        `${eachPrefix} $property must be a acessLayers array `,
                    validationOptions,
                ),
            },
        });
    };
};

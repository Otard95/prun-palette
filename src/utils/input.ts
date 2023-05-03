export function changeValue(input: Element, value: string) {
    // Get the property descriptor for the input element's value property
    var propDescriptor = Object.getOwnPropertyDescriptor(
        window['HTMLInputElement'].prototype,
        'value'
    );
    // Return if the property descriptor is undefined
    if (propDescriptor == undefined) { return; }
    // Get the native input value setter
    var nativeInputValueSetter = propDescriptor.set;
    // Return if the native input value setter is undefined
    if (nativeInputValueSetter == undefined) { return; }
    // Call the native input value setter with the input element and the new value
    nativeInputValueSetter.call(input, value);

    // Create a new input event
    var inputEvent = document.createEvent('Event');
    // Initialize the event as an 'input' event, bubbling and cancelable
    inputEvent.initEvent('input', true, true);
    // Dispatch the event to the input element
    input.dispatchEvent(inputEvent);
}

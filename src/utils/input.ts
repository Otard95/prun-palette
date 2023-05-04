/*
    PrUn Palette - A command pallet for Prosperous Universe
    Copyright (C) 2023  Stian Myklebostad

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/
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



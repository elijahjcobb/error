/**
 *
 * Elijah Cobb
 * elijah@elijahcobb.com
 * https://elijahcobb.com
 *
 *
 * Copyright 2019 Elijah Cobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

import { AFError } from "./AFError";
import { AFErrorType, AFErrorOriginType } from "./AFErrorTypes";
import { AFArrayList } from "af-collections";

/**
 * A class representing a collection of AFError instances.
 */
export class AFErrorStack {

	private trace: AFArrayList<AFError> = new AFArrayList<AFError>();

	/**
	 * Tack on a generic error message to this stack instance.
	 * @return {AFErrorStack} The instance.
	 */
	public withGenericError(): AFErrorStack {
		this.addGenericError();
		return this;
	}

	/**
	 * Get the trace of the error stack instance.
	 * @return {AFArrayList<AFError>} An array list of instances of AFError.
	 */
	public getTrace(): AFArrayList<AFError> {

		return this.trace;

	}

	/**
	 * Add an AFError instance to the stack.
	 * @param {AFError} err The error to be added to the stack.
	 */
	public addError(err: AFError): void {

		this.trace.insert(err, 0);

	}

	/**
	 * Create an error from a message and type and add to the error stack.
	 * @param {Error} error An error instance.
	 * @param {AFErrorOriginType} origin The origin of the error.
	 * @param {AFErrorTypes} type The type of the error.
	 */
	public add(origin: AFErrorOriginType, type: AFErrorType, error: Error): void {

		this.addError(new AFError(origin, type, error));

	}

	/**
	 * Add a generic error to the error stack.
	 */
	public addGenericError(): void {

		this.addError(new AFError(AFErrorOriginType.Unhandled, AFErrorType.InternalUnHandled, new Error("Internal server error.")));

	}

	/**
	 * Print the error stack to the console using the console.error() channel.
	 */
	public print(): void {

		let trace: string = "";

		this.trace.forEach((error: AFError) => {

			trace += `ERROR: ${error.getMessage()} (origin: ${error.getOriginString()}, type: ${error.getTypeString()})\n${error.getStackString()}\n`;

		});

		console.error(trace);

	}

	/**
	 * Get the AFError instance at the top of the trace for the client.
	 * @return {AFError} The client facing error.
	 */
	public getErrorForClient(): AFError {

		return this.trace.get(0);

	}

	/**
	 * Create a new AFErrorStack instance.
	 * @return {AFErrorStack} A new instance of AFErrorStack.
	 */
	public static new(): AFErrorStack {

		return new AFErrorStack();

	}

	/**
	 * Create a new AFErrorStack instance that is already populated with an AFError.
	 * @param {AFErrorOriginType} origin The origin of the error.
	 * @param {AFErrorType} type The type of error.
	 * @param {Error} error An error instance.
	 * @return {AFErrorStack} A new AFErrorStack instance.
	 */
	public static newWithMessageAndType(origin: AFErrorOriginType, type: AFErrorType, error: Error): AFErrorStack {

		let stack: AFErrorStack = new AFErrorStack();
		stack.add(origin, type, error);

		return stack;

	}

}
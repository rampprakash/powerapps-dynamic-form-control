import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import DynamicForm from "./src/DynamicForm";

export class DynamicFormControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    /**
     * Empty constructor.
     */

    private _container: HTMLDivElement;
    private _root: Root;
    private _currentValue: Record<string, string> = {};
    private _notifyOutputChanged: () => void;


    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {

        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;
        this._currentValue = context.parameters.txtfield.raw
            ? JSON.parse(context.parameters.txtfield.raw)
            : {};
        this._root = createRoot(container);
        this.renderComponent(context);

    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._currentValue = context.parameters.txtfield.raw
            ? JSON.parse(context.parameters.txtfield.raw)
            : {};
        this.renderComponent(context);

    }


    private renderComponent(context: ComponentFramework.Context<IInputs>) {
        this._root.render(
            React.createElement(DynamicForm, {
                value: this._currentValue,
                onChange: (newValue) => {
                    this._currentValue = newValue;
                    context.parameters.txtfield.raw = JSON.stringify(newValue);  // Store as JSON string
                    this._notifyOutputChanged();
                }
            })
        );
    }


    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
            txtfield: JSON.stringify(this._currentValue)
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        this._root.unmount();
    }
}

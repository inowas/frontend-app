export enum PopupPosition {
    TOP_CENTER = 'top center',
    TOP_LEFT = 'top left',
    TOP_RIGHT = 'top right',
    BOTTOM_CENTER = 'bottom center',
    BOTTOM_LEFT = 'bottom left',
    BOTTOM_RIGHT = 'bottom right',
    RIGHT_CENTER = 'right center',
    LEFT_CENTER = 'left center'
}

export type CallbackFunction<Response, Return> = (response: Response) => Return;
export type ErrorCallbackFunction = CallbackFunction<string, void>;

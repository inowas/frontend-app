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

export interface IToolInstance {
    id: string;
    tool: string;
    name: string;
    description: string;
    public: boolean;
    permissions: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    user_name: string;
}

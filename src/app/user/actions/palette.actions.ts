import {ActionWithPayload} from '../../common/actions';
import {ColorPalette} from '../../common/models/index';
import {paletteSchema} from '../../common/schemas/index';
import {normalize} from 'normalizr';

export const ADD_PALETTE = '[COLOR PALETTE] add';
export const ADD_PALETTE_RESPONSE = '[COLOR PALETTE] add Response';
export const CHANGE = '[COLOR PALETTE] change';
export const LOAD_ALL = '[COLOR PALETTE] load all';
export const LOAD_ALL_RESPONSE = '[COLOR PALETTE] load Response'; 
export const DELETE_PALETTE = '[COLOR PALETTE] delete';
export const DELETE_PALETTE_RESPONSE = '[COLOR PALETTE] delete Response';
export const UPDATE_PALETTE = '[COLOR PALETTE] update palette';
export const UPDATE_PALETTE_RESPONSE = '[COLOR PALETTE] update palette Response';

export interface ApiPaletteResponse {
  entities: {
    palettes: {
      [id: string]: ColorPalette
    }
  };
  result: string[];
}

export class AddUserPalette implements ActionWithPayload<ColorPalette> {
  readonly type = ADD_PALETTE;

  constructor(public payload: ColorPalette) {
  }
}

export class LoadAllPalettes {
  readonly type = LOAD_ALL;

  constructor() {
  }
}

export class LoadAllPalettesSuccess implements ActionWithPayload<ApiPaletteResponse> {
  readonly type = LOAD_ALL_RESPONSE;
  payload: ApiPaletteResponse;

  constructor(public palettes: ColorPalette[]) {
    this.payload = normalize(palettes, [paletteSchema]);
  }
}

export class LoadAllPalettesFailure implements ActionWithPayload<any> {
  readonly type = LOAD_ALL_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class AddUserPaletteSuccess implements ActionWithPayload<ApiPaletteResponse> {
  readonly type = ADD_PALETTE_RESPONSE;
  payload: ApiPaletteResponse;

  constructor(public colorPalette: ColorPalette) {
    this.payload = normalize([colorPalette], [paletteSchema]);
  }
}

export class AddUserPaletteFailure implements ActionWithPayload<any> {
  readonly type = ADD_PALETTE_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class ChangeColorPalette implements ActionWithPayload<ColorPalette> {
  readonly type = CHANGE;

  constructor(public payload: ColorPalette) {
  }
}

export class DeletePalette implements ActionWithPayload<String> {
  readonly type = DELETE_PALETTE;

  constructor(public payload: String) {
  }
}

export class DeletePaletteSuccess implements ActionWithPayload<String> {
  readonly type = DELETE_PALETTE_RESPONSE;

  constructor(public payload: String) {
  }
}

export class DeletePaletteFailure implements ActionWithPayload<any> {
  readonly type = DELETE_PALETTE_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class UpdateUserPalette implements ActionWithPayload<ColorPalette> {
  readonly type = UPDATE_PALETTE;

  constructor(public payload: ColorPalette) {
  }
}

export class UpdatePaletteSuccess implements ActionWithPayload<ApiPaletteResponse> {
  readonly type = UPDATE_PALETTE_RESPONSE;
  payload: ApiPaletteResponse;

  constructor(public palette: ColorPalette) {
    this.payload = normalize([palette], [paletteSchema]);
  }
}


type FontStyles = 'bold' | 'dim' | 'italic' | 'underline' | 'inverse' | 'hidden' | 'strikethrough';

type FontForegroundColors =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray';

type FontBackgroundColors =
  | 'blackBG'
  | 'redBG'
  | 'greenBG'
  | 'yellowBG'
  | 'blueBG'
  | 'magentaBG'
  | 'cyanBG'
  | 'whiteBG';

type Combined<A extends string, B extends string, C extends string> =
  | `${A}`
  | `${A} ${B}`
  | `${A} ${B} ${C}`;

export type LevelFontStyle =
  | Combined<FontStyles, FontForegroundColors, FontBackgroundColors>
  | Combined<FontStyles, FontBackgroundColors, FontForegroundColors>
  | Combined<FontForegroundColors, FontStyles, FontBackgroundColors>
  | Combined<FontForegroundColors, FontBackgroundColors, FontStyles>
  | Combined<FontBackgroundColors, FontStyles, FontForegroundColors>
  | Combined<FontBackgroundColors, FontForegroundColors, FontStyles>;

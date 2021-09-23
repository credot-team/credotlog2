import { logging } from './middleware';
declare const express: {
    logging: typeof logging;
};
export default express;

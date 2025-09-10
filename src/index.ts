import { createWorker } from 'tesseract.js';
import * as fs from 'fs';

(async () => {
	const worker = await createWorker('eng');

	const imageBuffer = fs.readFileSync('dist/example_template.png');

	const result = await worker.recognize(imageBuffer);

	console.log(result);
})();

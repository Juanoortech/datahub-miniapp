import fs from 'fs'
import path from 'path'
import svgToFont from 'svgtofont'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const inputDir = path.join(__dirname, '../src/shared/assets/icons')
const outputDir = path.join(__dirname, '../src/shared/assets/fonts/iconfont')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const options = {
  fontName: 'iconfont',
  css: true,
  html: true,
  svg: true,
  src: inputDir,
  dist: outputDir
};

svgToFont(options)
  .then(() => {
    console.log('Иконочный шрифт успешно сгенерирован!');
  })
  .catch((error) => {
    console.error('Ошибка при генерации шрифта:', error);
  });
import selenium from './src/selenium';
import chromedriver from './src/chromedriver';

export default async function(path) {
    console.log('Getting selenium');
    await selenium(path);
    console.log('Got selenium');

    console.log('Getting chromedriver');
    await chromedriver(path);
    console.log('Got chromedriver');
}

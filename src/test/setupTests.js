// src/test/setupTests.js
import matchers from '@testing-library/jasmine-dom';
import { cleanup } from '@testing-library/react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Según la versión, los matchers vienen envueltos en uno o dos "default"
// (con "type": "module"): se desenvuelven hasta llegar al objeto de matchers.
let domMatchers = matchers;
while (domMatchers && domMatchers.default) {
  domMatchers = domMatchers.default;
}

beforeEach(() => {
  jasmine.getEnv().addMatchers(domMatchers);
});

// Desmonta lo renderizado después de cada prueba
afterEach(() => {
  cleanup();
});
import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { SimpleDemo } from './SimpleDemo';

const debugNameSpaces = ['core:*', 'node:*', 'plugin:*', 'modifier'];

localStorage.debug = debugNameSpaces.join(',');

storiesOf('blink-mind', module).add('SimpleDemo', () => <SimpleDemo />);
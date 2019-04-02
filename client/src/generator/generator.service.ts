import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GeneratorService {

  constructor(private http: HttpClient) {}

  public getTest$(): Observable<string> {
    return this.http.get('/api/').pipe(map(response => JSON.stringify(response)));
  }

  public postTest$(): Observable<string> {
    return this.http.post('api/',{fileName:'testing'}).pipe(map(response => JSON.stringify(response)));
  }

  generateFile(fileName: string): string {
    return `
    import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

{{#if wantMessages}}
import { FormattedMessage } from 'react-intl';
import messages from './messages';
{{/if}}

/* eslint-disable react/prefer-stateless-function */
class ${fileName} extends {{{ type }}} {
  render() {
    return (
      <div>
      {{#if wantMessages}}
        <FormattedMessage {...messages.header} />
      {{/if}}
      </div>
    );
  }
}

{{ properCase name }}.propTypes = {};

export default {{ properCase name }};
    `;
  }
}
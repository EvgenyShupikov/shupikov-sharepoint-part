import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'HelloWebZavodWebPartStrings';
import HelloWebZavod from './components/HelloWebZavod';
import { IHelloWebZavodProps } from './components/IHelloWebZavodProps';

export interface IHelloWebZavodWebPartProps {
  description: string;
  multilineDescription: string;
  checkboxValue: boolean;
  dropdownValue: string;
  toggleValue: boolean;
}

export default class HelloWebZavodWebPart extends BaseClientSideWebPart<IHelloWebZavodWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IHelloWebZavodProps> = React.createElement(
      HelloWebZavod,
      {
        description: this.properties.description,
        multilineDescription: this.properties.multilineDescription,
        checkboxValue: this.properties.checkboxValue,
        dropdownValue: this.properties.dropdownValue,
        toggleValue: this.properties.toggleValue,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('multilineDescription', {
                  label: 'Multi-line Text Field',
                  multiline: true
                }),
                PropertyPaneCheckbox('checkboxValue', {
                  text: 'Checkbox'
                }),
                PropertyPaneDropdown('dropdownValue', {
                  label: 'Dropdown',
                  options: [
                    { key: '1', text: 'One' },
                    { key: '2', text: 'Two' },
                    { key: '3', text: 'Three' },
                    { key: '4', text: 'Four' }
                  ]
                }),
                PropertyPaneToggle('toggleValue', {
                  label: 'Toggle',
                  onText: 'On',
                  offText: 'Off'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

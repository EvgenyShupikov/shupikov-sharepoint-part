import * as React from 'react';
import styles from './HelloWebZavod.module.scss';
import { IHelloWebZavodProps } from './IHelloWebZavodProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class HelloWebZavod extends React.Component<IHelloWebZavodProps, {}> {
  public render(): React.ReactElement<IHelloWebZavodProps> {
    return (
      <div className={styles.helloWebZavod}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.title}>{escape(this.props.description)}</div>
              <div className={styles.subTitle}>{escape(this.props.multilineDescription)}</div>
              <div className={styles.description}>
                Webpart props:
                Checkbox '{this.props.checkboxValue ? 'checked' : 'unchecked'}';
                Dropdown '{this.props.dropdownValue}';
                Toggle '{this.props.toggleValue ? 'checked' : 'unchecked'}'
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

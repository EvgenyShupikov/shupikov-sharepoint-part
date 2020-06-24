import * as React from 'react';
import { connect } from 'react-redux';
import { ISPListItem } from '../../../types';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { RootState, selectors, actions } from '../../../store';
import { ItemEditorLocators } from './locators';


const useState = React.useState;

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> & {
  item: ISPListItem | undefined,
  isOpen: boolean,
  onClose: () => void,
};


const ItemEditor: React.FunctionComponent<Props> = ({ item, onClose, isOpen, saveItem, waitSave, errorSaveMessage }) => {

  const [title, setTitle] = useState(item !== undefined ? item.Title : '');
  const [code, setCode] = useState(item !== undefined ? item.Code : -1);
  const [desciption, setDesciption] = useState(item !== undefined ? item.Description : '');

  const save = () => {
    const itemForSave: ISPListItem = {
      Id: item !== undefined ? item.Id : -1,
      Title: title,
      Code: code,
      Description: desciption
    };

    saveItem(itemForSave);
  };

  return (
    <Dialog      
      hidden={!isOpen}
      onDismiss={onClose}
      dialogContentProps={{
        type: DialogType.normal,
        title: item ? 'Редактировать' : 'Добавить'
      }}
      modalProps={{
        isBlocking: true,
        styles: { main: { maxWidth: 450 } }
      }}
    >

      {/* form */}
      <div data-automationid={ItemEditorLocators.Dialog}>
        <TextField label="Название"
          data-automationid={ItemEditorLocators.InputTitle}
          disabled={waitSave}
          value={title}
          onChange={(event, newValue) => setTitle(newValue)} />

        <TextField label="Код" type="number"
          data-automationid={ItemEditorLocators.InputCode}
          disabled={waitSave}
          value={code > 0 ? code.toString() : ''}
          onChange={(event, newValue) => setCode(parseInt(newValue) || -1)} />

        <TextField label="Описание" multiline={true} autoAdjustHeight
          data-automationid={ItemEditorLocators.InputDescription}
          disabled={waitSave}
          value={desciption}
          onChange={(event, newValue) => setDesciption(newValue)} />
      </div>


      {errorSaveMessage &&
        <MessageBar messageBarType={MessageBarType.error} data-automationid={ItemEditorLocators.MessageWithError}>
          {errorSaveMessage}
        </MessageBar>
      }
      
      <DialogFooter>

        {/* save */}
        <PrimaryButton text="Сохранить" 
          disabled={waitSave} 
          onClick={save} 
          data-automationid={ItemEditorLocators.ButtonSave} />

        {/* cancel */}
        <DefaultButton onClick={onClose} text="Отмена" 
          disabled={waitSave} 
          data-automationid={ItemEditorLocators.ButtonCancel} />

      </DialogFooter>
    </Dialog>
  );
};


const mapStateToProps = (state: RootState) => ({
  errorSaveMessage: selectors.list.getErrorSaveMessage(state.list),
  waitSave: selectors.list.getWaitSave(state.list),
});


const mapDispatchToProps = {
  saveItem: (item: ISPListItem) => actions.list.saveItem(item),
};


export default connect(mapStateToProps, mapDispatchToProps)(ItemEditor);
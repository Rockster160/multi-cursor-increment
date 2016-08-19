'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-text-editor', { 'multi-cursor-increment:tonum': () => this.tonum() }))
    this.subscriptions.add(atom.commands.add('atom-text-editor', { 'multi-cursor-increment:increment': () => this.increment() }))
    this.subscriptions.add(atom.commands.add('atom-text-editor', { 'multi-cursor-increment:decrement': () => this.decrement() }))
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  tonum() {
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelectionsOrderedByBufferPosition();
    selections.forEach(convertSelectionToIndexNumber)
  },

  increment() {
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    selections.forEach(incrementSelection)
  },

  decrement() {
    editor = atom.workspace.getActiveTextEditor();
    selections = editor.getSelections();
    selections.forEach(decrementSelection)
  },

};

convertSelectionToIndexNumber = function(selection, idx) {
  selection.insertText((idx + 1).toString());
}

incrementSelection = function(selection, idx) {
  var foundText = selection.getText(), foundNum = +foundText;
  if (foundNum.toString() == foundText) {
    var bufferRange = selection.getBufferRange(), newText = (foundNum + 1).toString();
    selection.insertText(newText)
    if (newText.length > foundText.length) {
      bufferRange['end']['column'] += 1
    }
    selection.setBufferRange(bufferRange)
  }
}

decrementSelection = function(selection, idx) {
  var foundText = selection.getText(), foundNum = +foundText;
  if (foundNum.toString() == foundText) {
    var bufferRange = selection.getBufferRange(), newText = (foundNum - 1).toString();
    selection.insertText(newText)
    if (newText.length > foundText.length) {
      bufferRange['end']['column'] += 1
    } else if (newText.length < foundText.length) {
      bufferRange['end']['column'] -= 1
    }
    selection.setBufferRange(bufferRange)
  }
}

import {CopyBehaviorImpl} from './copy-behaviors';

describe('Copy Behaviors', () => {
  describe('#copyEmbeddedWidget', () => {
    it('should create embedded widget with provided placeholder id', () => {
      const expected = `<widget-launcher class="widget" placeholder-id="abc" style="width: 512px; height: 512px;"></widget-launcher>`;
      const copyBehavior = new CopyBehaviorImpl('abc');
      copyBehavior.copyEmbeddedWidget();
      expect(copyBehavior.embeddedWidget).toEqual(expected);
    });

    it('should execute copy command from document', () => {
      const spy = spyOn(document, 'execCommand');
      const copyBehavior = new CopyBehaviorImpl('abc');
      copyBehavior.copyEmbeddedWidget();
      expect(spy).toHaveBeenCalledWith('copy');
    });
  });
});

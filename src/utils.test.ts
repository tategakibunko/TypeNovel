import { Utils } from '../dist';

describe('Utils.escapeAttr', () => {
  test('should escape unsafe characters', () => {
    expect(Utils.escapeAttr('<script src=\'foo.js\'>'))
      .toBe('&#60;script src=&#39;foo.js&#39;&#62;');
  });
});

describe('Utils.camelToChain', () => {
  test('myFamilyName -> my-family-name', () => {
    expect(Utils.camelToChain('myFamilyName')).toBe('my-family-name');
  });
  test('myfamilyname -> myfamilyname', () => {
    expect(Utils.camelToChain('myfamilyname')).toBe('myfamilyname');
  });
});

describe('Utils.trimHeadSpaces', () => {
  test('should remove normal head space', () => {
    expect(Utils.trimHeadSpaces('    1, 2, switch!')).toBe('1, 2, switch!');
  });
  test('should ignore heading \u3000(IDEOGRAPHIC SPACE)', () => {
    expect(Utils.trimHeadSpaces('　1, 2, switch!')).toBe('　1, 2, switch!');
  });
});

describe('Utils.attributes', () => {
  test('should output html attr strings', () => {
    expect(Utils.attributes({
      'hoge': '"foo"',
      'hige': '<danger>',
    })).toBe('hoge="&#34;foo&#34;" hige="&#60;danger&#62;"');
  });
});

describe('Utils.sd2Dq', () => {
  test('should cut single quote at heading and trailing pos', () => {
    expect(Utils.sq2Dq("'foo'")).toBe('"foo"')
  });
  test('should cut single quote at heading and trailing pos(empty string)', () => {
    expect(Utils.sq2Dq("''")).toBe('""')
  });
});
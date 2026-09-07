# Remotion Basic Sample

## Setup

```
# create 'blank' project.
> npx create-video@latest

# install packages.
> npm install

# add agent skills.
> npx remotion skills add
```

## Use

```
# lanuch app.
npm run dev
```

## Sequenceのタイムライン名に関する注意点

`<Sequence name="...">` の `name` は、Remotion Studioのタイムラインに表示するクリップ名です。

再生を連続させる場合でも、タイムライン上でクリップごとに異なる名前を表示したいときは、`<Sequence>` をComposition内で直接、兄弟要素として宣言します。`from` と `durationInFrames` で各クリップの表示区間を指定してください。

```tsx
export const MyComponent = () => {
  return (
    <AbsoluteFill>
      <Sequence name="Sequence 1" durationInFrames={20}>
        <ColorSequence backgroundColor="#2563eb" text="Sequence 1" />
      </Sequence>
      <Sequence name="Sequence 2" from={20} durationInFrames={20}>
        <ColorSequence backgroundColor="#eb2556" text="Sequence 2" />
      </Sequence>
    </AbsoluteFill>
  );
};
```

`<Sequence>` 自体を再利用コンポーネントの内部に1か所だけ置き、propsで `name` を渡す方式では、Studioが複数の呼び出しを同じタイムライン要素として扱い、最初の名前が共有されることがあります。再利用コンポーネントは、背景や文字などの見た目だけを担当させると安全です。

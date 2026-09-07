# Remotion Basic Sample

[Remotion](https://www.remotion.dev/) によるシンプルなサンプル集になります。  
サンプルを3つ用意しているので、はじめて触る方はぜひご参考ください。

**動作環境**

| 項目    | バージョン              |
| ------- | ----------------------- |
| Node.js | 22.12 以上              |
| npm     | 10 以上                 |
| OS      | Windows / macOS / Linux |

## セットアップ・起動方法

`npm install`でパッケージをインストールした後、`npm run dev`で起動できます。  
必要に応じて`npx remotion skills add`でAgents用のスキルを追加してください。

```
# install packages.
> npm install

# add agent skills.
> npx remotion skills add
```

```
# launch app.
> npm run dev
```

## サンプル

各Sampleは `src/compositions/` に1ファイルずつ配置しており、`src/Root.tsx` から `<Composition>` として登録しています。  
いずれも 1280x720 / 30fps です。

| Sample                                                                              | 内容                                                                                                                                                                                                                                        | プレビュー                                                        |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Sample01**<br>[Sample01Composition.tsx](src/compositions/Sample01Composition.tsx) | **Sequence遷移とトランジション**<br>前半は `<Sequence>` を `from` / `durationInFrames` で並べただけの単純な切り替え。<br>後半は `<TransitionSeries>` を使い、slide・fadeのトランジションを挟んで繋いでいます。                              | <img src="docs/readme/sample01.gif" width="400" alt="Sample01" /> |
| **Sample02**<br>[Sample02Composition.tsx](src/compositions/Sample02Composition.tsx) | **画像表示とループアニメーション**<br>`<Img>` + `staticFile()` で `public/` の画像を表示します。<br>主役はゆらゆら揺れ続け（Wiggle）、一定周期で跳ねます（Bounce）。背景は水玉タイルを斜めにスクロールさせています。                        | <img src="docs/readme/sample02.gif" width="400" alt="Sample02" /> |
| **Sample03**<br>[Sample03Composition.tsx](src/compositions/Sample03Composition.tsx) | **応用アニメーション（キャラクター同士のかけ合い）**<br>`interpolate()` / `spring()` / `Easing` を組み合わせた3つのSequence構成。<br>スライドイン、バネのズームイン、テロップ表示、衝突時の白フラッシュと画面揺れ、吹っ飛び演出を含みます。 | <img src="docs/readme/sample03.gif" width="400" alt="Sample03" /> |

## Structure

```
remotion-basic-sample/
├─ docs/
│  └─ readme/                       # README掲載用のGIF
├─ public/
│  └─ images/                       # staticFile() で参照する画像
├─ src/
│  ├─ Root.tsx                      # Compositionの登録（動画一覧の定義）
│  ├─ index.ts                      # Remotionのエントリポイント
│  ├─ compositions/                 # Sampleごとの動画本体
│  │  ├─ Sample01Composition.tsx
│  │  ├─ Sample02Composition.tsx
│  │  └─ Sample03Composition.tsx
│  ├─ components/                   # 見た目だけを担当する表示部品
│  │  ├─ SimpleBackground.tsx       # 背景色 + 中央テキスト
│  │  └─ TileScrollBackground.tsx   # 水玉タイルの斜めスクロール背景
│  └─ effects/                      # 動きの計算・ラッパー
│     ├─ LoopMotionEffect.ts        # サイン波ベースの共通計算（oscillate / bump / spin）
│     └─ WiggleEffect.tsx           # 揺らしラッパーと跳ねるtransform生成
└─ remotion.config.ts               # レンダリング設定（CLI実行時のみ適用）
```

### 役割分担の方針

- **compositions**: フレームからパラメータを計算し、シーン全体を組み立てる。Sampleごとの「演出」を書く場所。
- **components**: propsで受け取った見た目を描画するだけ。フレーム依存の演出ロジックは持たせない。
- **effects**: 「揺らす」「跳ねる」といった動きの計算を再利用可能な形で切り出す。数式は `LoopMotionEffect.ts` に集約し、見た目のパラメータは呼び出し側で指定する。

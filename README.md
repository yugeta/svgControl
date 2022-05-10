SvgControl
===
```
Date    : 2022.05.10
Author  : Yugeta.Koji
Version : 2.0.0
```

# Summary
- svgファイルをhtml内に読み込んでjavascriptなどでコントロールできるようにする。
- imgタグのsvgファイルをsvgタグに入れ替える処理。

# Howto
- headタグ内に記載
<script src='svgControl/src/svgControl.js'></script>

- ページonload以後に実行
<script>
new SvgControl({
  exclusion_style_tag : true,  // svg内のstyleタグを除外します。 (記入しない場合はfalse扱い)
})
</script>

# Sample
- sampleフォルダ内を参考


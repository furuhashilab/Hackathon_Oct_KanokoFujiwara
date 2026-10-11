#!/bin/sh
# Re Visualizer に導入するための ZIP を作成するスクリプト（macOS / Linux 用）
# 使い方: リポジトリのフォルダで  sh make-zip.sh  を実行
# ZIP のルート直下に reearth.yml と thailand-widget.js だけを入れます。
set -e
cd "$(dirname "$0")"
mkdir -p dist
rm -f dist/thailand-memories.zip
zip -j dist/thailand-memories.zip reearth.yml thailand-widget.js
echo "作成しました: dist/thailand-memories.zip"
unzip -l dist/thailand-memories.zip

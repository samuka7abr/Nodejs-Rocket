#!/bin/bash

echo ""
echo "📁 Commitando em: $(pwd)"
echo ""

echo "Selecione o tipo de commit:"
echo "1 - feat (nova feature)"
echo "2 - fix (correção de bug)"
echo "3 - refactor (refatoração)"
echo "4 - chore (infra, config)"
echo "5 - docs (documentação)"
echo "6 - test (testes)"
echo "7 - perf (performance)"
echo "8 - build (build/dependências)"
echo ""

read -p "Digite o número correspondente: " tipo

case $tipo in
  1) prefixo="feat" ;;
  2) prefixo="fix" ;;
  3) prefixo="refactor" ;;
  4) prefixo="chore" ;;
  5) prefixo="docs" ;;
  6) prefixo="test" ;;
  7) prefixo="perf" ;;
  8) prefixo="build" ;;
  *) echo "❌ Tipo inválido"; exit 1 ;;
esac

echo ""
read -p "Mensagem do commit: " msg

if [ -z "$msg" ]; then
  echo "❌ A mensagem do commit não pode estar vazia."
  exit 1
fi

echo ""
echo "🚀 Comitando com: $prefixo: $msg"
echo ""

git add .
git commit -m "$prefixo: $msg" || {
  echo "❌ Erro ao tentar commitar. Verifique se há validações ou hooks ativos."
  exit 1
}

git push && echo "✅ Push feito com sucesso!"

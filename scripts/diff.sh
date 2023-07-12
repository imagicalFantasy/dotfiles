if [[ $# -lt 2 ]] ; then
    echo '2 arguments obligatoire (SHA de commits ou tags)'
else
    git archive --output=$2.zip $2 $(git diff --diff-filter=ACMRTUXB --name-only $1 $2)
fi

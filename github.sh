read -p "commit message : " desc
git add . && \
git commit -m "$desc" && \
git push
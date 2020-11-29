#!/bin/bash

if [[ $PWD =~ ^.*/scripts$ ]]; then
  cd ../
fi

cp ../backend/src/roles/roles.ts ./src/generated/roles.ts || exit 1
cp ../backend/src/permissions/permissions.ts ./src/generated/permissions.ts || exit 1

echo -e 'Successfully copied the files with constants from the backend!'

exit 0

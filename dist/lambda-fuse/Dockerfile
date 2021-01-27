FROM public.ecr.aws/lambda/nodejs:12

COPY index.js package.json worker.js /var/task/
COPY data/ /var/task/data/

RUN npm install

# Command can be overwritten by providing a different command in the template directly.
CMD ["index.lambdaHandler"]

FROM public.ecr.aws/lambda/nodejs:12

COPY **/*.js **/*.json ./

RUN npm install

# Command can be overwritten by providing a different command in the template directly.
CMD ["index.lambdaHandler"]

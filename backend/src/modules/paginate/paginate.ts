import { Schema, Document } from 'mongoose';

export interface QueryResult {
  results: Record<string, any> | Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface IOptions {
  sortBy?: string;
  projectBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
  groupBy?: string;
}

const paginate = <T extends Document>(schema: Schema<T>): void => {
  schema.static('paginate', async function (filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
    const sort = options.sortBy
      ? options.sortBy
          .split(',')
          .map((option) => {
            const [key, order] = option.split(':');
            return (order === 'desc' ? '-' : '') + key;
          })
          .join(' ')
      : 'createdAt';

    // const project = options.projectBy
    //   ? options.projectBy
    //       .split(',')
    //       .map((option) => {
    //         const [key, include] = option.split(':');
    //         return (include === 'hide' ? '-' : '') + key;
    //       })
    //       .join(' ')
    //   : '-createdAt -updatedAt';

    const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 100;
    const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise: any = this.find(filter).sort(sort).skip(skip).limit(limit).exec(); // select(project)

    if (options.populate) {
      options.populate.split(',').forEach((populateOption: any) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a: string, b: string) => ({ path: b, populate: a }))
        );
      });
    }

    const [totalResults, results] = await Promise.all([countPromise, docsPromise]);

    const totalPages = Math.ceil(totalResults / limit);

    if (options.groupBy) {
      const groupedResults: Record<string, T[]> = results.reduce((acc: any, doc: T) => {
        const key = doc[options.groupBy as keyof T];

        if (typeof key === 'string') {
          const normalizedKey = key.toLowerCase().replace(/\s+/g, '');

          if (!acc[normalizedKey]) {
            acc[normalizedKey] = [];
          }
          acc[normalizedKey].push(doc);
        }

        return acc;
      }, {});

      return {
        results: groupedResults,
        page,
        limit,
        totalPages,
        totalResults,
      };
    }

    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
  });
};

export default paginate;

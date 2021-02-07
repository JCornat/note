import { Injectable } from '@angular/core';
import { Note } from './note';
import { RequestService } from '../request/request.service';
import { Request } from '../request/request';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor(
    private requestService: RequestService,
  ) {
    //
  }

  public async pullAll(options: { search: any, offset: number, limit: number }): Promise<{ limit: number, data: Note[] }> {
    const optionsQuery: Request = {
      url: `/api/note`,
      header: {
        optionalAuthentication: true,
      },
      body: {
        search: options.search,
        offset: options.offset,
        limit: options.limit,
      },
    };

    const data: any = await this.requestService.get(optionsQuery).toPromise();
    console.log(data);

    return {
      limit: data.data.limit,
      data: data.data.data,
    };
  }

  public async pullOne(id: string): Promise<any> {
    const optionsQuery = {
      url: `/api/note/${id}`,
    };

    const data: any = await this.requestService.get(optionsQuery).toPromise();
    return data.data;
  }

  public async update(options: any): Promise<void> {
    const optionsQuery = {
      url: `/api/note/${options._id}`,
      body: {
        ...options,
      },
    };

    await this.requestService.put(optionsQuery).toPromise();
  }

  public async add(options: { [key: string]: any }): Promise<void> {
    const optionsQuery = {
      url: `/api/note`,
      body: {
        ...options,
      }
    };

    await this.requestService.post(optionsQuery).toPromise();
  }

  public async delete(id): Promise<void> {
    const optionsQuery = {
      url: `/api/note/${id}`,
    };

    await this.requestService.delete(optionsQuery).toPromise();
  }
}

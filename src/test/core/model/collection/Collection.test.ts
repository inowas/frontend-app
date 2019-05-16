import {Collection} from '../../../../core/model/collection/Collection';

export default {};

interface ITestItem {
    id: string;
    rank: number;
}

class TestCollection extends Collection<ITestItem> {}

const collection = new TestCollection();
collection.add({id: 'test1', rank: 5});
collection.add({id: 'test2', rank: 1});

test('Add and order items', () => {
    expect(collection.first.id).toEqual('test1');
    collection.orderBy('rank', 'asc');
    expect(collection.length).toEqual(2);
    expect(collection.first.id).toEqual('test2');
});

test('FindBy', () => {
    expect(collection.findById('test2')!.rank).toEqual(1);
    expect(collection.findById('test3')).toBeNull();
});

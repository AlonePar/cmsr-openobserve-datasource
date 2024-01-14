import { RAQBFieldTypes, SQLSelectableValue } from '../../sql/types';

export function mapFieldsToTypes(columns: SQLSelectableValue[]) {
    const fields: SQLSelectableValue[] = [];
    for (const col of columns) {
        let type: RAQBFieldTypes = 'text';
        switch (col.type) {
            case 'Boolean':
                type = "boolean";
                break;
            case 'Int8':
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'UInt8':
            case 'UInt16':
            case 'UInt32':
            case 'UInt64':
            case 'Float16':
            case 'Float32':
            case 'Float64':
                type = 'number';
                break;
            case 'Utf8':
            case 'LargeUtf8':
                type = 'text';
                break;
            case 'Date32':
                type = 'date'
                break;
            case 'Date64':
                type = 'datetime'
                break;
            default:
                if (col.type?.startsWith("Time")) {
                    type = 'time'
                } else if (col.type?.startsWith("Timestamp")) {
                    type = "datetime"
                }
                break;
        }
        fields.push({ ...col, raqbFieldType: type, icon: mapColumnTypeToIcon(type, col.type)});
    }
    return fields;
}

export function mapColumnTypeToIcon(typeByClient: RAQBFieldTypes, typeByServer?: string) {
    switch (typeByClient) {
        case 'number':
            return 'calculator-alt';
        case 'boolean':
            return 'toggle-off';
        case 'datetime':
        case 'date':
        case 'time':
            return 'clock-nine';
        case 'text':
            return 'text';
        default:
            return undefined;
    }
}

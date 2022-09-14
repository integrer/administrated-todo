import React from 'react';
import styled from '@emotion/styled';
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  useEventCallback,
} from '@mui/material';
import { todoListOrderTypes } from '@app/shared/features/todos';
import { useTodoListUrlParams } from './urlParams';
import { oneOf } from '@app/shared/utils/oneOf';

const OrderByItemContent = styled.span`
  text-transform: capitalize;
`;

const isOrderByType = oneOf(...todoListOrderTypes);

const TodoListControls = () => {
  const [params, setParams] = useTodoListUrlParams();

  const handleOrderByChange = useEventCallback((ev: SelectChangeEvent<typeof params.orderBy>) => {
    const { value } = ev.target;
    isOrderByType(value) && setParams({ orderBy: value });
  });

  const handleDescChange = useEventCallback(() => setParams({ desc: !params.desc }));

  return (
    <Stack rowGap='0.5rem'>
      <Select
        value={params.orderBy}
        onChange={handleOrderByChange}
        renderValue={(v) => <OrderByItemContent>{v}</OrderByItemContent>}
      >
        {todoListOrderTypes.map((item) => (
          <MenuItem key={item} value={item}>
            <OrderByItemContent>{item}</OrderByItemContent>
          </MenuItem>
        ))}
      </Select>
      <FormControlLabel label='Descending' control={<Checkbox checked={params.desc} onChange={handleDescChange} />} />
    </Stack>
  );
};

export default TodoListControls;

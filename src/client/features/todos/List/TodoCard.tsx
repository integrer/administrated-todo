import React from 'react';
import { Box, Card, CardContent, Link, Stack, Typography, useEventCallback } from '@mui/material';
import { ITodoRecord } from '@app/shared/features/todos';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useAccount } from '@app/client/utils/auth';
import { useToggleTodoFulfilledMutation } from '@app/client/features/api';
import { Checkbox as MuiCheckbox } from '@mui/material';

interface ITodoCheckBoxProps {
  id: number;
  fulfilled: boolean;
}

const TodoCheckBox = ({ id, fulfilled }: ITodoCheckBoxProps) => {
  const [updateChecked, { isLoading }] = useToggleTodoFulfilledMutation();
  return <MuiCheckbox disabled={isLoading} checked={fulfilled} onChange={useEventCallback(() => updateChecked(id))} />;
};

const ReadonlyTodoCheckBox = ({ fulfilled }: ITodoCheckBoxProps) => <MuiCheckbox readOnly checked={fulfilled} />;

interface ITodoCardProps {
  model: ITodoRecord<string>;
}

export function TodoCard({ model }: ITodoCardProps) {
  const [account] = useAccount();
  const asAdmin = !!account?.isAdmin;
  const CheckBox = asAdmin ? TodoCheckBox : ReadonlyTodoCheckBox;

  return (
    <Card>
      <CardContent>
        <Stack direction='row' alignItems='center'>
          <Box sx={{ p: '0.5rem' }}>
            <Typography>
              <CheckBox id={model.id} fulfilled={model.fulfilled} />
            </Typography>
          </Box>
          <Stack>
            <Typography variant='h5' component='div'>
              {model.username} &lt;<Link href={`mailto:${model.email}`}>{model.email}</Link>&gt;
            </Typography>
            <Typography sx={{ mb: '0.75rem' }} color='text.secondary'>
              {format(parseISO(model.createdAt), 'Pp', { locale: uk })}
            </Typography>
            <Typography variant='body2'>
              <span dangerouslySetInnerHTML={{ __html: model.body }}></span>
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
